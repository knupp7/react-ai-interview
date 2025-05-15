import styles from "../../styles/interview.module.css";

const ProfileImageUploader = ({
	profileImage,
	setProfileImage
}) => {

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setProfileImage(imageUrl);
		}
	};

	return (
		<div className={styles.profile_image_wrapper}>
			{/* profile image */}
			<div className={styles.profile_image}>
				{profileImage ? (
					<img src={profileImage} alt="profile" className={styles.image_preview} />
				) : (
					<span role="img" aria-label="default">🙍‍♂️</span>
				)}
			</div>
			<label className={styles.upload_button}>
				<img src="/ic_camera.svg" alt="카메라" className={styles.camera_icon} />
				<input
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					style={{ display: "none" }}
				/>
			</label>
		</div>
	);
}

export default ProfileImageUploader;