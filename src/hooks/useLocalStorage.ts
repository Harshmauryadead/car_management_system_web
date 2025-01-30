import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | null = null) {
	const [value, setValue] = useState<T | null | undefined>(undefined);

	useEffect(() => {
		const _value = localStorage.getItem(key);
		setValue(_value ? JSON.parse(_value) : JSON.stringify(initialValue));
	}, [key, initialValue]);

	function _setValue(_value: T | null) {
		if (_value === null) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, JSON.stringify(_value));
		}
		setValue(_value);
	}

	return [value, _setValue] as const;
}

export function useReadLocalStorage<T>(key: string) {
	const [value, setValue] = useState<T | null | undefined>(undefined);

	useEffect(() => {
		const _value = localStorage.getItem(key);
		if (_value) {
			setValue(JSON.parse(_value));
		} else {
			setValue(null);
		}
	}, [key]);

	return value;
}
