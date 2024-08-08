import type { Notification } from '@/types/notification'
import http from '@/utils/http'

export function getNotification(): Promise<{ notifications: Notification[] }> {
  // Create an array of fake notifications
  const notifications: Notification[] = [
    {
      id: 1,
      time: '2024-07-31T09:00:00Z',
      content:
        'Your application has been approved. Your application has been approved. Your application has been approved. Your application has been approved. Your application has been approved. Your application has been approved.'
    },
    { id: 2, time: '2024-07-31T10:00:00Z', content: 'Your order #1234 has been shipped.' },
    { id: 3, time: '2024-07-31T11:00:00Z', content: 'Meeting with the team at 2 PM.' },
    { id: 4, time: '2024-07-31T12:00:00Z', content: 'New comment on your post.' },
    {
      id: 5,
      time: '2024-07-31T13:00:00Z',
      content: 'Your password has been successfully changed.'
    },
    { id: 6, time: '2024-07-31T14:00:00Z', content: 'You have a new friend request.' },
    { id: 7, time: '2024-07-31T15:00:00Z', content: 'Reminder: Meeting with client at 3 PM.' },
    { id: 8, time: '2024-07-31T16:00:00Z', content: 'System update completed successfully.' },
    {
      id: 9,
      time: '2024-07-31T17:00:00Z',
      content: 'New article published: "How to Improve Productivity".'
    },
    { id: 10, time: '2024-07-31T18:00:00Z', content: 'You have been tagged in a photo.' },
    { id: 11, time: '2024-07-31T19:00:00Z', content: 'Your subscription plan has been upgraded.' },
    { id: 12, time: '2024-07-31T20:00:00Z', content: 'New job offer available in your area.' },
    { id: 13, time: '2024-07-31T21:00:00Z', content: 'Password reset request received.' },
    { id: 14, time: '2024-07-31T22:00:00Z', content: 'You have a new message from Jane Smith.' },
    { id: 15, time: '2024-07-31T23:00:00Z', content: 'Your invoice #5678 has been generated.' },
    { id: 16, time: '2024-08-01T00:00:00Z', content: 'New follower: Mike Johnson.' },
    { id: 17, time: '2024-08-01T01:00:00Z', content: 'You have a new review on your profile.' },
    {
      id: 18,
      time: '2024-08-01T02:00:00Z',
      content:
        'Your application has been approved. Your application has been approved. Your application has been approved.'
    },
    {
      id: 19,
      time: '2024-08-01T03:00:00Z',
      content: 'Reminder: Submit your report by end of day.'
    },
    { id: 20, time: '2024-08-01T04:00:00Z', content: 'System maintenance scheduled for tomorrow.' }
  ]

  return Promise.resolve({ notifications }) // Sửa lỗi tại đây
}
