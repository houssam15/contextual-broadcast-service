import { describe, it, expect, vi } from 'vitest';
import { ParentStrategy } from '../../infrastructure/strategies/parent_strategy.ts';

describe('ParentStrategy', () => {
    const mockDb = { execute: vi.fn() };
    const loggerMock =  {
            info: vi.fn(),
            error: vi.fn()
    };
    const strategy = new ParentStrategy(mockDb as any, loggerMock as any);

    // 1. Role Support check
    describe('Role Support', () => {
        it.each([
            ['parent', true],
            ['teacher', false],
            ['student', false],
        ])('supports("%s") should return %s', (role, expected) => {
            expect(strategy.supports(role)).toBe(expected);
        });
    });

    // 2. Data Retrieval logic
    describe('getRelatedIds', () => {
        it('should return children IDs for a given parent ID', async () => {
            // Mocking the DB: In your schema, students have a parent_id
            mockDb.execute.mockResolvedValue([
                [{ id: '101' }, { id: '102' }] // These are the kids
            ]);
            
            const result = await strategy.getRelatedIds('3'); // Parent Jane Doe
            
            // Assert: Ensure we query the users table for students linked to this parent
            expect(mockDb.execute).toHaveBeenCalledWith(
                expect.stringContaining('WHERE parent_id = ?'), 
                ['3']
            );
            
            expect(result).toEqual(['101', '102']);
        });

        it('should return an empty array if the parent has no registered children', async () => {
            mockDb.execute.mockResolvedValue([[]]);
            
            const result = await strategy.getRelatedIds('99');
            
            expect(result).toEqual([]);
        });
    });
});