import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './Profile.css';
import { AuthContext } from '../../Context/AuthContext/AuthContext';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-page max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">{t('profile.title')}</h1>
      {user ? (
        <div className="profile-details flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={t('profile.avatarAlt')}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-600">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-medium">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="profile-info bg-white p-4 rounded-md shadow">
            <h3 className="text-lg font-medium mb-2">{t('profile.info')}</h3>
            <p>{t('profile.email')}: {user.email}</p>
            <p>{t('profile.joined')}: {new Date(user.joinedDate).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">{t('profile.noUser')}</p>
      )}
    </div>
  );
};

export default Profile;