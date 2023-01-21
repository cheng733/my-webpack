import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { ItemTypes } from './ItemTypes'

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
    width: 200,
    height: 200,
    marginRight: 20
}

export interface CardProps {
    id: any
    text: string
    index: number
    moveCard: (dragIndex: number, hoverIndex: number, dragTopic: number, hoverTopic: number) => void
    topic: number
}

interface DragItem {
    index: number
    id: string
    type: string
    topic: number
}

export const Card: FC<CardProps> = ({ id, text, index, moveCard, topic }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const dragTopic = item.topic
            const hoverIndex = index
            const hoverTopic = topic
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            const hoverMiddleX =
                (hoverBoundingRect.right - hoverBoundingRect.left) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY && hoverClientX < hoverMiddleX) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY && hoverClientX > hoverMiddleX) {
                return
            }

            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex, dragTopic, hoverTopic)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.

            // 这里不同的频道交换模块会有问题--------
            item.index = hoverIndex
            if(hoverTopic !== dragTopic){
                item.topic = hoverTopic
            }
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            return { id, index, topic }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))
    return (
        <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
            {text}
        </div>
    )
}
