import useToggle from "./useToggle";

export const useModal = ({ onOpen = () => true, onClose = () => true } = {}) => {
	const [show, toggle] = useToggle(false);

	const open = () => {
		onOpen();
		toggle(true);
	};

	const close = () => {
		onClose();
		toggle(false);
	};

	return { show, toggle, open, close };
};

export default useModal;
