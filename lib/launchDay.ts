export function isLaunchDay(): boolean {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-indexed, so December is 11
  const day = now.getDate()

  // Launch day: December 25, 2025
  return year === 2025 && month === 11 && day === 25
}
