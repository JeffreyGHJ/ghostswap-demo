const ViewSwitch = (props) => {
  return (
    <div className="flex rounded-lg border-[1px] border-[rgba(221,218,218,0.2)] bg-gray-800">
      <div
        style={props.viewMode === 'dashboard' ? { backgroundColor: 'black' } : {}}
        className="flex items-center justify-between px-5 py-2 text-sm text-white transition-colors rounded-lg cursor-pointer hover:text-[#f7b531]"
        onClick={() => props.updateViewMode('dashboard')}
      >
        Dashboard
      </div>
      <div
        style={props.viewMode === 'leaderboard' ? { backgroundColor: 'black' } : {}}
        className="flex items-center justify-between px-5 py-2 text-sm text-white transition-colors rounded-lg cursor-pointer hover:text-[#f7b531]"
        onClick={() => props.updateViewMode('leaderboard')}
      >
        Leaderboard
      </div>
    </div>
  )
}

export default ViewSwitch
