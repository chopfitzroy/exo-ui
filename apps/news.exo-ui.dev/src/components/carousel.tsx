import { h as _ } from 'preact';

import { createCarouselComponent } from "components";

const { Carousel: Control } = createCarouselComponent<typeof items>();

const items = [
	{
		url: 'https://picsum.photos/200/300?random=1',
		title: 'Caption one',
	},
	{
		url: 'https://picsum.photos/200/300?random=2',
		title: 'Caption two',
	},
	{
		url: 'https://picsum.photos/200/300?random=3',
		title: 'Caption three',
	},
]

export const Carousel = () => {
	return (
		<Control.Provider items={items}>
			<Control.Map>
				{({ data, metadata }) => (
					<div style={{ display: metadata.isSelected ? 'block' : 'none'}}>
						<img src={data.url} />
						<p>{data.title}</p>
					</div>
				)}
			</Control.Map>
		</Control.Provider>
	)
}
