export const Button = ({
	className = "",
	...props
}: React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>) => (
	<button
		className={`px-4 py-2 rounded bg-blue-600 text-white ${className}`}
		{...props}
	/>
);
