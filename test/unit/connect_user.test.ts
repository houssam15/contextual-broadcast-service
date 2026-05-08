import { describe, it, expect, vi } from 'vitest';
import { connectUserUseCase } from '../../application/use_cases/connect_user';

describe('ConnectUserUseCase',() => {
    it('should track the user and return related rooms', async () => {
        const mockUser = { id: '1', name: 'Houssam', role: 'teacher' };
        const mockDeps = {
            userRepository: {
                findById: vi.fn().mockResolvedValue(mockUser),
                getRelatedUserIds: vi.fn().mockResolvedValue(['4', '5'])
            },
            presenceTracker: {
                setOnline: vi.fn().mockResolvedValue(true)
            },
            logger: {
                info: vi.fn(),
                error: vi.fn()
            }
        };

        const result = await connectUserUseCase('1', mockDeps as any);

        expect(mockDeps.userRepository.findById).toHaveBeenCalledWith('1');
        expect(mockDeps.presenceTracker.setOnline).toHaveBeenCalledWith('1');
        expect(result.rooms).toContain('4');
        expect(result.rooms).toContain('5');
        expect(result.user.name).toBe('Houssam');
    });
});