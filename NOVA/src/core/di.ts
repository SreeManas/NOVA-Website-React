// ============================================
// Dependency Injection Container
// ============================================
// Exposes singleton instances of services to the React application.
// This is the ONLY place where specific repository implementations are bound.

import { CommunityService } from '../services/CommunityService';
// import { MockCommunityRepository } from '../repositories/mock/MockCommunityRepository';
import { SupabaseCommunityRepository } from '../repositories/supabase/SupabaseCommunityRepository';

// For Launchpad
import { LaunchpadService } from '../services/LaunchpadService';
import { MockLaunchpadRepository } from '../repositories/mock/MockLaunchpadRepository';

// Instantiate repositories
// const mockCommunityRepo = new MockCommunityRepository(); // Swapped out!
const supabaseCommunityRepo = new SupabaseCommunityRepository(); // Swapped in!
const mockLaunchpadRepo = new MockLaunchpadRepository();

// Instantiate services and inject dependencies
export const communityService = new CommunityService(supabaseCommunityRepo);
export const launchpadService = new LaunchpadService(mockLaunchpadRepo);

// Note: To switch to a real REST backend in the future, simply swap the 
// MockCommunityRepository with a RestCommunityRepository above. No other
// code in the UI or Services needs to change.
