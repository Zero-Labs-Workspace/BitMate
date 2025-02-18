import React from "react";

export default function header({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-3xl font-bold">{title}</h1>
			<p className="text-xl">{description}</p>
		</div>
	);
}
