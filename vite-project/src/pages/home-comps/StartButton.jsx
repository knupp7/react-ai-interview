import { useNavigate } from "react-router-dom";
import styles from "../../styles/Home.module.css";
import HOME_STRINGS from "../../constants/homeStrings";

const StartButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        const token = localStorage.getItem("sessionToken");
        if (!token) {
            navigate("/login");
        } else {
            navigate("/interview");
        }
    };

    return (
        <button className={styles.start_button} onClick={handleClick}>
            {HOME_STRINGS.HERO.START_BUTTON}
        </button>
    );
}

export default StartButton;