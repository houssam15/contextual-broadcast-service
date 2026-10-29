const readline = require('readline');

/**
 * Strips file extensions (.ts, .js) from module path quotes.
 */
function stripExtension(modulePath) {
    return modulePath.replace(/\.(ts|js)(['"])$/, '$2');
}

/**
 * Checks if an imported symbol name represents a TypeScript type or interface.
 */
function isTypeName(name) {
    const cleanName = name.split(/\s+as\s+|:/)[0].trim();

    const typePatterns = [
        /^I[A-Z]/,             // e.g., IUser, IRepository
        /Repository$/,          // e.g., UserRepository
        /Tracker$/,             // e.g., PresenceTracker, RedisPresenceTracker
        /Strategy$/,            // e.g., UserRoleStrategy
        /Logger$/,              // e.g., Logger
        /Dependencies$/,        // e.g., AppDependencies
        /Interface$/,           // e.g., ConnectionInterface
        /Type$/,                // e.g., UserType
        /DTO$/,                 // e.g., CreateUserDTO
        /Model$/,               // e.g., UserModel
        /Payload$/              // e.g., AuthPayload
    ];

    return typePatterns.some(pattern => pattern.test(cleanName));
}

/**
 * Transforms ES Module import statements to CommonJS require calls.
 */
function transformImportsToRequire(code, forceTypeToRequire = false) {
    const lines = code.split('\n');

    return lines.map(line => {
        const trimmed = line.trim();

        // Mode 2: Force ALL import type -> require()
        if (forceTypeToRequire && /^import\s+type\s+/.test(trimmed)) {
            const destructuredTypeMatch = trimmed.match(/^import\s+type\s*\{\s*([^}]+)\s*\}\s*from\s*(['"][^'"]+['"]);?/);
            if (destructuredTypeMatch) {
                const [, rawImports, rawModulePath] = destructuredTypeMatch;
                const modulePath = stripExtension(rawModulePath);
                const items = rawImports.split(',').map(i => i.trim().replace(/^type\s+/, '')).filter(Boolean);
                const cjsItems = items.map(item => item.replace(/\s+as\s+/g, ': '));
                return `const { ${cjsItems.join(', ')} } = require(${modulePath});`;
            }

            const defaultTypeMatch = trimmed.match(/^import\s+type\s+([^\s{}*]+)\s+from\s*(['"][^'"]+['"]);?/);
            if (defaultTypeMatch) {
                const [, defaultImport, rawModulePath] = defaultTypeMatch;
                const modulePath = stripExtension(rawModulePath);
                return `const ${defaultImport} = require(${modulePath});`;
            }
        }

        // Preserve explicit import type
        if (/^import\s+type\s+/.test(trimmed)) {
            const cleaned = line.replace(/^import\s+type\s+/, 'import type ');
            return cleaned.replace(/(['"][^'"]+?)\.(ts|js)(['"])/, '$1$3');
        }

        // Destructured imports: import { A, B as C } from 'path';
        const destructuredMatch = trimmed.match(/^import\s*\{\s*([^}]+)\s*\}\s*from\s*(['"][^'"]+['"]);?/);
        if (destructuredMatch) {
            const [, rawImports, rawModulePath] = destructuredMatch;
            const modulePath = stripExtension(rawModulePath);
            const items = rawImports.split(',').map(i => i.trim()).filter(Boolean);

            const valueImports = [];
            const typeImports = [];

            items.forEach(item => {
                const isTypeKeyword = item.startsWith('type ');
                const cleanName = item.replace(/^type\s+/, '').trim();

                if (!forceTypeToRequire && (isTypeKeyword || isTypeName(cleanName))) {
                    typeImports.push(cleanName);
                } else {
                    const cjsItem = item.replace(/^type\s+/, '').replace(/\s+as\s+/g, ': ');
                    valueImports.push(cjsItem);
                }
            });

            const resultLines = [];

            if (typeImports.length > 0) {
                resultLines.push(`import type { ${typeImports.join(', ')} } from ${modulePath};`);
            }

            if (valueImports.length > 0) {
                resultLines.push(`const { ${valueImports.join(', ')} } = require(${modulePath});`);
            }

            return resultLines.join('\n');
        }

        // Namespace imports: import * as A from 'path';
        const namespaceMatch = trimmed.match(/^import\s*\*\s*as\s+([^\s]+)\s+from\s*(['"][^'"]+['"]);?/);
        if (namespaceMatch) {
            const [, alias, rawModulePath] = namespaceMatch;
            return `const ${alias} = require(${stripExtension(rawModulePath)});`;
        }

        // Default imports: import A from 'path';
        const defaultMatch = trimmed.match(/^import\s+([^\s{}*]+)\s+from\s*(['"][^'"]+['"]);?/);
        if (defaultMatch) {
            const [, defaultImport, rawModulePath] = defaultMatch;
            const modulePath = stripExtension(rawModulePath);

            if (!forceTypeToRequire && isTypeName(defaultImport)) {
                return `import type ${defaultImport} from ${modulePath};`;
            }
            return `const ${defaultImport} = require(${modulePath});`;
        }

        return line;
    }).join('\n');
}

/**
 * Mode 3: Transforms CommonJS require calls back to ESM `import type` or `import`.
 */
function transformRequireToImport(code) {
    const lines = code.split('\n');

    return lines.map(line => {
        const trimmed = line.trim();

        // Match: const { A, B: C } = require('path'); or let/var
        const destructuredRequire = trimmed.match(/^(?:const|let|var)\s*\{\s*([^}]+)\s*\}\s*=\s*require\((['"][^'"]+['"])\);?/);
        if (destructuredRequire) {
            const [, rawItems, rawModulePath] = destructuredRequire;
            const modulePath = stripExtension(rawModulePath);
            const items = rawItems.split(',').map(i => i.trim()).filter(Boolean);

            const valueItems = [];
            const typeItems = [];

            items.forEach(item => {
                // Convert CJS aliasing (`A: B`) back to ESM (`A as B`)
                const esmItem = item.replace(/:\s*/g, ' as ');
                const cleanName = item.split(':')[0].trim();

                if (isTypeName(cleanName)) {
                    typeItems.push(cleanName);
                } else {
                    valueItems.push(esmItem);
                }
            });

            const resultLines = [];

            if (typeItems.length > 0) {
                resultLines.push(`import type { ${typeItems.join(', ')} } from ${modulePath};`);
            }

            if (valueItems.length > 0) {
                resultLines.push(`import { ${valueItems.join(', ')} } from ${modulePath};`);
            }

            return resultLines.join('\n');
        }

        // Match: const A = require('path'); or let/var
        const defaultRequire = trimmed.match(/^(?:const|let|var)\s+([^\s{}*]+)\s*=\s*require\((['"][^'"]+['"])\);?/);
        if (defaultRequire) {
            const [, name, rawModulePath] = defaultRequire;
            const modulePath = stripExtension(rawModulePath);

            if (isTypeName(name)) {
                return `import type { ${name} } from ${modulePath};`;
            }
            return `import ${name} from ${modulePath};`;
        }

        return line;
    }).join('\n');
}

// Terminal CLI Loop Setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptMode() {
    console.log('\n==================================================');
    console.log(' Select Mode:');
    console.log('   [1] ESM -> CommonJS (Keep TS import type)');
    console.log('   [2] ESM -> Force ALL to require()');
    console.log('   [3] CommonJS require() -> ESM import type / import');
    console.log('   [q] Quit');
    console.log('==================================================');

    rl.question('Choice (1/2/3/q): ', (answer) => {
        const choice = answer.trim().toLowerCase();

        if (choice === 'q') {
            console.log('\n Goodbye!');
            rl.close();
            process.exit(0);
        }

        if (!['1', '2', '3'].includes(choice)) {
            console.log('\n Invalid choice. Please enter 1, 2, 3, or q.');
            return promptMode();
        }

        promptImports(choice);
    });
}

function promptImports(mode) {
    const modeLabels = {
        '1': 'Mode 1: ESM -> CJS (Standard)',
        '2': 'Mode 2: ESM -> Force require()',
        '3': 'Mode 3: require() -> import type / import'
    };

    console.log(`\n Paste your code below [${modeLabels[mode]}].`);
    console.log(' Press ENTER twice on an empty line when done:\n');

    let inputBuffer = [];

    const lineHandler = (line) => {
        if (line.trim() === '') {
            if (inputBuffer.length > 0) {
                rl.off('line', lineHandler);

                const rawInput = inputBuffer.join('\n');
                console.log('\n================ Converted Output ================\n');
                
                if (mode === '3') {
                    console.log(transformRequireToImport(rawInput));
                } else {
                    console.log(transformImportsToRequire(rawInput, mode === '2'));
                }
                
                console.log('\n==================================================');

                // Loop back to mode prompt
                promptMode();
            }
        } else {
            inputBuffer.push(line);
        }
    };

    rl.on('line', lineHandler);
}

// Start CLI
promptMode();