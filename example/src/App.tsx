import { Input } from "./Input";
import { Items } from "./Items";

export const App = (): JSX.Element => {
	return (
		<div className="h-screen bg-gray-50">
			<div className="container mx-auto py-40 flex flex-col gap-8">
				<Input />
				<Items />
			</div>
		</div>
	);
};
