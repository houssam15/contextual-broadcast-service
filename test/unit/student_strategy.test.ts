// test/unit/strategies/student_strategy.test.ts
import { describe, it, expect, vi } from 'vitest';
import { StudentStrategy } from '../../infrastructure/strategies/student_strategy.ts';

describe('StudentStrategy', () => {
    const mockDb = { execute: vi.fn() };
    const loggerMock =  {
            info: vi.fn(),
            error: vi.fn()
    };
    const strategy = new StudentStrategy(mockDb as any, loggerMock as any);

    it.each([
        ['student', true],
        ['teacher', false],
        ['parent', false],
    ])('supports("%s") should return %s', (role, expected) => {
        expect(strategy.supports(role)).toBe(expected);
    });

    it('should return teacher ID for a given student', async () => {
        // Students usually have ONE teacher_id in your schema
        mockDb.execute.mockResolvedValue([[{ teacher_id: '1' }]]);
        
        const result = await strategy.getRelatedIds('4');
        
        // Asserting the SQL specific to students
        expect(mockDb.execute).toHaveBeenCalledWith(
            expect.stringContaining('SELECT teacher_id'), 
            ['4']
        );
        expect(result).toEqual(['1']);
    });
});