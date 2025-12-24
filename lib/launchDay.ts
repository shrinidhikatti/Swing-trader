export function isLaunchDay(): boolean {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-indexed, so December is 11
  const day = now.getDate()

  // Launch day: December 25, 2025
  return year === 2025 && month === 11 && day === 25
}

export function isBeforeLaunch(): boolean {
  // MANUAL CONTROL: Set to false on launch day at 1:00 PM to show the website
  // For testing: true (shows countdown)
  // For production before launch: true (shows countdown)
  // On launch day at 1:00 PM: Change to false (shows normal website)
  return true

  // Alternative: Automatic time-based (use if you want automatic switching)
  // const now = new Date()
  // const launchDate = new Date('2025-12-25T13:00:00+05:30')
  // return now < launchDate
}
