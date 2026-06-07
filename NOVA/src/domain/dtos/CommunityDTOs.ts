// ============================================
// Data Transfer Objects (DTOs) — Community
// ============================================
// DTOs represent the payloads for state-mutating operations.
// We avoid DTOs for simple read operations to keep the architecture pragmatic.

import type { DiscussionCategory, Department, YearOfStudy } from '../models/CommunityModels';

export interface CreateDiscussionDTO {
  title: string;
  category: DiscussionCategory;
  content: string;
}

export interface CreateReplyDTO {
  discussionId: string;
  content: string;
}

export interface NovaIdApplicationDTO {
  fullName: string;
  rollNumber: string;
  department: Department;
  year: YearOfStudy;
  collegeEmail: string;
  idCardFileName: string;
  idCardFile?: File;
  motivation: string;
}
