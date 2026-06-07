// ============================================
// Data Transfer Objects (DTOs) — Launchpad
// ============================================

import type { StudentProfile } from '../models/LaunchpadModels';

export interface GenerateCareerPlanDTO {
  profile: StudentProfile;
}
