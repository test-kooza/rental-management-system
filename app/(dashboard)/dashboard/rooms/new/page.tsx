import { getUserProperties } from "@/actions/rooms"
import RoomForm from "@/components/Forms/RoomForm"


export default async function NewRoomPage() {
  const properties = await getUserProperties()

  return (
    <div className="py-3">
      <RoomForm properties={properties} />
    </div>
  )
}

