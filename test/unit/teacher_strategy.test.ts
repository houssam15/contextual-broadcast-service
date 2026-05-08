import { describe, it, expect, vi } from 'vitest';
import { TeacherStrategy } from '../../infrastructure/strategies/teacher_strategy.ts';

describe('TeacherStrategy',() => {
    const loggerMock =  {
            info: vi.fn(),
            error: vi.fn()
    };
    const mockDb = { execute: vi.fn() };
    const strategy = new TeacherStrategy(mockDb as any, loggerMock as any);

    describe('Role Support', () => {
        it.each([
            ['teacher', true],
            ['student', false],
            ['parent', false],
            ['admin', false],
        ])('supports("%s") should return %s', (role, expected) => {
            expect(strategy.supports(role)).toBe(expected);
        });
    });

    describe('getRelatedIds', () => {
        it('should return student IDs for a given teacher ID', async () => {
            mockDb.execute.mockResolvedValue([[{ id: '10' }, { id: '11' }]]);
            
            const result = await strategy.getRelatedIds('1');
            
            expect(result).toEqual(['10', '11']);
            expect(mockDb.execute).toHaveBeenCalled();
        });
    });
});