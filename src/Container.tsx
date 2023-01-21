import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { Collapse } from 'antd'
import { Card } from './Card'
const { Panel } = Collapse;
const style = {
    width: 1200,
    height: 500,
    display: 'flex',
    'flex-wrap': "wrap"
}

export interface video {
    id: number
    text: string
}
export interface Item {
    id: number
    videos: video[]
    name: string
}
export interface ContainerState {
    cards: Item[]
}

export const Container: FC = () => {

    const [cards, setCards] = useState([
        {
            name: 'This is panel header 1',
            id: 1,
            videos: [{
                id: 1,
                text: 'Write a cool JS library',
            },
            {
                id: 2,
                text: 'Make it generic enough',
            },
            {
                id: 3,
                text: 'Write README',
            },
            {
                id: 4,
                text: 'Create some examples',
            },
            {
                id: 5,
                text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
            },
            {
                id: 6,
                text: '???',
            },
            {
                id: 7,
                text: 'PROFIT',
            },
            {
                id: 8,
                text: 'hhhh',
            },]
        },
        {
            name: "This is panel header 2",
            id: 2,
            videos: [{
                id: 9,
                text: 'next Write a cool JS library',
            },
            {
                id: 10,
                text: 'next Make it generic enough',
            },
            {
                id: 11,
                text: 'next Write README',
            },
            {
                id: 12,
                text: 'next Create some examples',
            },
            {
                id: 13,
                text: 'next Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
            },
            {
                id: 14,
                text: 'next ???',
            },
            {
                id: 15,
                text: 'next PROFIT',
            },
            {
                id: 16,
                text: 'next hhhh',
            }]
        }
    ])
    const [activeKey, setActiveKey] = useState<string | string[]>(['1'])
    const moveCard = useCallback((dragIndex: number, hoverIndex: number, dragTopic: number, hoverTopic: number) => {
        const curCards = cards.slice()
        const dragLen = `${dragTopic}`.length
        const hoverLen = `${hoverTopic}`.length
        const curDragIndex = parseInt(`${dragIndex}`.slice(dragLen))
        const curHoverIndex = parseInt(`${hoverIndex}`.slice(hoverLen))
        if (dragTopic === hoverTopic) {
            const topic = curCards.find(card => card.id === dragTopic)
            let videos = topic?.videos
            if (videos) {
                const dragItem = videos[curDragIndex]
                videos.splice(curDragIndex, 1)
                videos.splice(curHoverIndex, 0, dragItem)
            }
        } else {
            const dragCards = curCards.find(card => card.id === dragTopic)
            const hoverCards = curCards.find(card => card.id === hoverTopic)
            const dragVideos = dragCards?.videos
            const hoverVideos = hoverCards?.videos
            if (dragVideos && hoverVideos) {
                const dragItem = dragVideos[curDragIndex]
                dragVideos.splice(curDragIndex, 1)
                hoverVideos.splice(curHoverIndex, 0, dragItem)
            }
        }
        setCards(curCards)
    }, [])

    const renderCard = useCallback(
        (card: { id: number; text: string; }, topic: number, index: number) => {
            return (
                <Card
                    key={card.id}
                    index={parseInt(`${topic}${index}`)}
                    id={card.id}
                    text={card.text}
                    moveCard={moveCard}
                    topic={topic}
                />
            )
        },
        [],
    )
    const onChange = (key: string | string[]) => {
        setActiveKey(key)
    };
    
    return (
        <Collapse defaultActiveKey={['1']} onChange={onChange} activeKey={activeKey}>
            {cards?.map(card => {
                const { name, videos, id } = card
                return <Panel header={name} key={id}>
                    <div style={style}>{videos.map((card, i) => renderCard(card, id, i))}</div>
                </Panel>
            })}
        </Collapse>
    )

}
