import { useCollection, useMethod, useSubscription } from "@lib/index";

import { Button } from "./Button";

type Entry = { id: string; message: string };

const Item = ({ data }: { data: Entry }) => {
	const { error, loading, exec } = useMethod("remove", data.id);

	return (
		<li className="shadow p-4 bg-white flex items-center gap-4">
			<span className="flex-grow">{data.message}</span>
			{!!error && <span>{error.message ?? error.toString()}</span>}
			<span>({data.id})</span>
			<Button onClick={exec} disabled={loading}>
				Remove
			</Button>
		</li>
	);
};

export const Items = () => {
	const { ready, error } = useSubscription("test");

	const data = useCollection<Entry>("test");

	if (!ready) {
		return <>Loading data...</>;
	}

	if (error) {
		return <>{error.message ?? error.toString()}</>;
	}

	if (!data || data.length <= 0) {
		return <>No data!</>;
	}

	return (
		<ul className="flex flex-col gap-2">
			{data.map((entry) => (
				<Item key={entry.id} data={entry} />
			))}
		</ul>
	);
};
