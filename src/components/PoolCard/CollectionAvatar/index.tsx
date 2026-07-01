import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const CollectionAvatar = ({ avatar, height = 14, width = 14 }) => {
  return (
    <div id="collection-avatar">
      {avatar && <img src={avatar} width={width} height={height} className="mr-1 rounded-full" />}
      {!avatar && <QuestionMarkCircleIcon width={width} height={height} className="mr-1" />}
    </div>
  )
}

export default CollectionAvatar
