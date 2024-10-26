import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, removeUser, editUser } from './store/counterReducer';
import { setLanguage } from './store/languageReducer';
import { setTheme } from './store/themeReducer';

function App() {
  const dispatch = useDispatch();
  
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, username: '', email: '', age: '' });
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const ageRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleAddUser = () => {
    setCurrentUser({ id: Date.now(), username: '', email: '', age: '' });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSaveUser = () => {
    const { username, email, age } = currentUser;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    const alertMessages = {
      en: {
        incomplete: "Please fill out all fields",
        invalidEmail: "Invalid email format",
      },
      ru: {
        incomplete: "Пожалуйста, заполните все поля",
        invalidEmail: "Неверный формат электронной почты",
      },
    };

    const messages = alertMessages[language];

    if (!username) {
      alert(messages.incomplete);
      usernameRef.current.focus();
      return;
    }
    if (!email || !emailRegex.test(email)) {
      alert(messages.invalidEmail);
      emailRef.current.focus();
      return;
    }
    if (!age) {
      alert(messages.incomplete);
      ageRef.current.focus();
      return;
    }

    if (editMode) {
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? currentUser : user
      );
      setUsers(updatedUsers);
    } else {
      setUsers([...users, currentUser]);
    }
    setShowModal(false);
  };

  const themeClasses = theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800';

  return (
    <div className={`app flex flex-col items-center p-6 ${themeClasses} transition duration-500`}>

      <div className="mb-4 flex gap-6">
        <div className="flex items-center">
          <label className="mr-2 font-semibold">{language === 'en' ? 'Select Language:' : 'Выберите язык:'}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`border rounded p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-900'} transition duration-300`}
          >
            <option value="en">English</option>
            <option value="ru">Русский</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="mr-2 font-semibold">{language === 'en' ? 'Theme:' : 'Тема:'}</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={`border rounded p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-900'} transition duration-300`}
          >
            <option value="light">{language === 'en' ? 'Light' : 'Светлый'}</option>
            <option value="dark">{language === 'en' ? 'Dark' : 'Темный'}</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleAddUser}
        className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
      >
        {language === 'en' ? 'Add User' : 'Добавить пользователя'}
      </button>

      <div className="user-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="user-card p-4 border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:shadow-xl hover:scale-105">
            <h2 className="text-2xl font-semibold">{user.username}</h2>
            <p>{language === 'en' ? 'Email' : 'Электронная почта'}: {user.email}</p>
            <p>{language === 'en' ? 'Age' : 'Возраст'}: {user.age}</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleEditUser(user)}
                className="px-4 py-1 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition duration-300"
              >
                {language === 'en' ? 'Edit' : 'Редактировать'}
              </button>
              <button
                onClick={() => {
                  const updatedUsers = users.filter(u => u.id !== user.id);
                  setUsers(updatedUsers);
                }}
                className="px-4 py-1 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition duration-300"
              >
                {language === 'en' ? 'Delete' : 'Удалить'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal bg-white p-8 rounded-lg shadow-lg w-96 transition-transform transform hover:scale-105">
            <h2 className="text-3xl font-bold mb-4">
              {editMode ? (language === 'en' ? 'Edit User' : 'Редактировать пользователя') : (language === 'en' ? 'Add User' : 'Добавить пользователя')}
            </h2>
            <input
              type="text"
              placeholder={language === 'en' ? 'Username' : 'Имя пользователя'}
              value={currentUser.username}
              onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
              ref={usernameRef}
              className={`w-full mb-2 p-2 border border-gray-300 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-900'} transition duration-300`}
            />
            <input
              type="email"
              placeholder={language === 'en' ? 'Email' : 'Электронная почта'}
              value={currentUser.email}
              onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              ref={emailRef}
              className={`w-full mb-2 p-2 border border-gray-300 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-900'} transition duration-300`}
            />
            <input
              type="number"
              placeholder={language === 'en' ? 'Age' : 'Возраст'}
              value={currentUser.age}
              onChange={(e) => setCurrentUser({ ...currentUser, age: e.target.value })}
              ref={ageRef}
              className={`w-full mb-4 p-2 border border-gray-300 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-900'} transition duration-300`}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition duration-300"
              >
                {language === 'en' ? 'Cancel' : 'Отмена'}
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
              >
                {language === 'en' ? 'Save' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
