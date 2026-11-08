import { getAccessToken } from './googleAuth';

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
  ownerId?: string;
  creationTime?: string;
  updateTime?: string;
  enrollmentCode?: string;
  courseState?: 'ACTIVE' | 'ARCHIVED' | 'PROVISIONED' | 'DECLINED' | 'SUSPENDED';
  alternateLink?: string;
  teacherGroupEmail?: string;
  courseGroupEmail?: string;
}

export interface ClassroomCourseWork {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  state?: 'PUBLISHED' | 'DRAFT' | 'DELETED';
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  dueDate?: { year: number; month: number; day: number };
  dueTime?: { hours: number; minutes: number };
  maxPoints?: number;
  workType?: 'ASSIGNMENT' | 'SHORT_ANSWER_QUESTION' | 'MULTIPLE_CHOICE_QUESTION';
}

export interface ClassroomAnnouncement {
  id: string;
  courseId: string;
  text: string;
  state?: 'PUBLISHED' | 'DRAFT' | 'DELETED';
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
}

export interface ClassroomMaterial {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  state?: 'PUBLISHED' | 'DRAFT' | 'DELETED';
  alternateLink?: string;
  creationTime?: string;
}

export interface ClassroomTopic {
  id: string;
  courseId: string;
  name: string;
  updateTime?: string;
}

/**
 * List all courses available to the authenticated user
 */
export async function listClassroomCourses(courseStates: string[] = ['ACTIVE']): Promise<ClassroomCourse[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Classroom.');
  }

  const queryParams = new URLSearchParams();
  courseStates.forEach((state) => queryParams.append('courseStates', state));

  const res = await fetch(`https://classroom.googleapis.com/v1/courses?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch Classroom courses (status ${res.status}).`);
  }

  const data = await res.json();
  return data.courses || [];
}

/**
 * List course work items (assignments, questions) for a specific course
 */
export async function listCourseWork(courseId: string): Promise<ClassroomCourseWork[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Classroom.');
  }

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch coursework (status ${res.status}).`);
  }

  const data = await res.json();
  return data.courseWork || [];
}

/**
 * List announcements for a specific course
 */
export async function listAnnouncements(courseId: string): Promise<ClassroomAnnouncement[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Classroom.');
  }

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch announcements (status ${res.status}).`);
  }

  const data = await res.json();
  return data.announcements || [];
}

/**
 * List classwork materials for a course
 */
export async function listCourseWorkMaterials(courseId: string): Promise<ClassroomMaterial[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Classroom.');
  }

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWorkMaterials`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch course materials (status ${res.status}).`);
  }

  const data = await res.json();
  return data.courseWorkMaterial || [];
}

/**
 * List topics for a course
 */
export async function listClassroomTopics(courseId: string): Promise<ClassroomTopic[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Classroom.');
  }

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/topics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch topics (status ${res.status}).`);
  }

  const data = await res.json();
  return data.topic || [];
}

/**
 * Create a new Google Classroom course (Requires user confirmation before invoking)
 */
export async function createClassroomCourse(course: {
  name: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
}): Promise<ClassroomCourse> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Classroom.');
  }

  const res = await fetch('https://classroom.googleapis.com/v1/courses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: course.name,
      section: course.section || 'IDLTech Studio Accelerator',
      descriptionHeading: course.descriptionHeading || 'No-Code Automation & AI Systems',
      description: course.description || 'Live cohort managed by IDLTech App Studio.',
      room: course.room || 'Virtual Live Lab',
      ownerId: 'me',
      courseState: 'ACTIVE',
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create course in Google Classroom (status ${res.status}).`);
  }

  return res.json();
}

/**
 * Post an announcement to a course stream (Requires user confirmation before invoking)
 */
export async function postClassroomAnnouncement(courseId: string, text: string): Promise<ClassroomAnnouncement> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Classroom.');
  }

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      state: 'PUBLISHED',
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to post announcement (status ${res.status}).`);
  }

  return res.json();
}

/**
 * Create coursework/assignment in a course (Requires user confirmation before invoking)
 */
export async function createClassroomAssignment(
  courseId: string,
  assignment: { title: string; description?: string; maxPoints?: number }
): Promise<ClassroomCourseWork> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Classroom.');
  }

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: assignment.title,
      description: assignment.description || '',
      maxPoints: assignment.maxPoints || 100,
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create coursework assignment (status ${res.status}).`);
  }

  return res.json();
}
