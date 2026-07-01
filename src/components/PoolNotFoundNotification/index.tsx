import { Loading } from "@nextui-org/react";

const PoolNotFoundNotification = ({ poolAddress }) => {
  return (
    <div className="w-full h-[50rem] flex items-center justify-center text-[56px] text-center">
      {/**
        <div>
          <div className="font-bold tracking-tighter">Pool Not Found:</div>
          <div className="font-mono text-[20px] w-fit rounded-md px-3 py-2 bg-dark-800 m-auto">{poolAddress}</div>
        </div>
      **/}
      <Loading color="primary" textColor="primary" size="xl">
        Loading Pool...
      </Loading>
    </div>
  )
}

export default PoolNotFoundNotification
