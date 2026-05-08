import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MySqlUserRepository } from '../../infrastructure/database/mysql_user_repository.ts';

describe('MySqlUserRepository', () => {
    let mockDb: any;
    let mockLogger: any;
    let teacherStrategy: any;
    let studentStrategy: any;
    let repo: MySqlUserRepository;

    beforeEach(() => {
        // 1. Setup mocks for everything
        mockDb = { execute: vi.fn() };
        mockLogger = { info: vi.fn(), error: vi.fn() };

        // 2. Mock the Strategy behaviors
        teacherStrategy = {
            supports: vi.fn((role) => role === 'teacher'),
            getRelatedIds: vi.fn().mockResolvedValue(['student-1'])
        };
        studentStrategy = {
            supports: vi.fn((role) => role === 'student'),
            getRelatedIds: vi.fn().mockResolvedValue(['teacher-1'])
        };

        // 3. Inject the mocked strategies into the repo
        repo = new MySqlUserRepository(mockDb, mockLogger, [teacherStrategy, studentStrategy]);
    });

    it('should use the TeacherStrategy when the user is a teacher', async () => {
        // Simulate finding a teacher in the DB
        mockDb.execute.mockResolvedValue([[{ id: '1', role: 'teacher' }]]);

        const relatedIds = await repo.getRelatedUserIds('1');

        // Verify the repo checked the roles
        expect(teacherStrategy.supports).toHaveBeenCalledWith('teacher');
        // Verify the repo used the correct strategy
        expect(teacherStrategy.getRelatedIds).toHaveBeenCalledWith('1');
        // Verify the repo DID NOT use the wrong strategy
        expect(studentStrategy.getRelatedIds).not.toHaveBeenCalled();
        
        expect(relatedIds).toEqual(['student-1']);
    });

    it('should log an error and return empty array if no strategy matches', async () => {
        // Simulate a user with a weird role like 'admin'
        mockDb.execute.mockResolvedValue([[{ id: '99', role: 'admin' }]]);

        const result = await repo.getRelatedUserIds('99');

        expect(result).toEqual([]);
        expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('No strategy found'));
    });
});