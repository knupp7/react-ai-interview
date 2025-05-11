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
		<div className="profile-image-wrapper">
			{/* profile image */}
			<div className="profile-image">
				{profileImage ? (
					<img src={profileImage} alt="profile" className="image-preview" />
				) : (
					<span role="img" aria-label="default">🙍‍♂️</span>
				)}
			</div>
			<label className="upload-button">
				<img src="/ic_camera.svg" alt="카메라" className="camera-icon" />
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