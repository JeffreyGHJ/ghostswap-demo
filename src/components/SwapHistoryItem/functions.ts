export function getTimeSince(timestamp) {
  const diffInMilis = Date.now() - timestamp * 1000
  const diffInSec = ~~(diffInMilis / 1000)
  const diffInMins = ~~(diffInMilis / (1000 * 60))
  const diffInHours = ~~(diffInMilis / (1000 * 60 * 60))
  const diffInDays = ~~(diffInMilis / (1000 * 60 * 60 * 24))

  if (diffInDays >= 1) return diffInDays + (diffInDays < 2 ? ' day ago' : ' days ago')
  if (diffInHours >= 1) return diffInHours + (diffInHours < 2 ? ' hour ago' : ' hrs ago')
  if (diffInMins >= 1) return diffInMins + (diffInMins < 2 ? ' min ago' : ' mins ago')
  else return diffInSec + ' secs ago'
}
