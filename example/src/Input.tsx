import { useRef, useState } from "react";

import { generateId, useMethod } from "@lib/context";

import { Button } from "./Button";

export const Input = () => {
	const [value, setValue] = useState("");
	const id = useRef(generateId());

	const { error, loading, exec } = useMethod("add", id.current, {
		message: value,
	});

	const handleClick = () => {
		exec().then(() => {
			id.current = generateId();
			setValue("");
		});
	};

	return (
		<div className="bg-white pr-4 flex flex-row gap-4 items-center shadow-lg">
			<div className="flex-grow">
				<input
					onChange={(e) => setValue(e.target.value)}
					placeholder="Note text"
					className="p-4 w-full"
					value={value}
					type="text"
				/>
				{!!error && (
					<p className="ml-2 text-red-600">
						{error.message ?? error.toString()}
					</p>
				)}
			</div>
			<Button disabled={loading || !value} onClick={handleClick}>
				Add
			</Button>
		</div>
	);
};
