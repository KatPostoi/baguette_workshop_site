import './header.css';
import headerImage from '../../../assets/images/block_header.png';

export const Header = () => {
  return (
    <div className="process-header">
      <img className="process-header_image" src={headerImage} alt="HeaderWallpaper" />
    </div>
  );
};
