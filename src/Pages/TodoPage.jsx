import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'user-crud-users';

const TodoPage = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadFromApi = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('API yanıtı başarısız');
      }
      // API çağrısını çalıştırıyoruz ancak ekranda sadece Türkçe local örnekleri kullanıyoruz
      await response.json();
      const localExamples = [
        {
          id: 1001,
          name: 'Ahmet Yılmaz',
          email: 'ahmet.yilmaz@example.com',
          phone: '0532 000 00 00',
          company: 'Yılmaz Teknoloji',
          isLocal: true,
        },
        {
          id: 1002,
          name: 'Ayşe Demir',
          email: 'ayse.demir@example.com',
          phone: '0543 111 11 11',
          company: 'Demir Yazılım',
          isLocal: true,
        },
        {
          id: 1003,
          name: 'Mehmet Kaya',
          email: 'mehmet.kaya@example.com',
          phone: '0555 222 22 22',
          company: 'Kaya Danışmanlık',
          isLocal: true,
        },
      ];

      // Ekranda sadece Türkçe örnek kullanıcılar görünsün
      setUsers(localExamples);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localExamples));
    } catch (err) {
      setError('Veriler alınırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Eski verilerdeki API örneklerini temizle (isLocal === false olanlar)
        const onlyLocal = parsed.filter((user) => user.isLocal !== false);
        setUsers(onlyLocal);
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    loadFromApi();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const handleAddUser = (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      isLocal: true,
    };

    setUsers((prev) => [...prev, newUser]);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
  };

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleResetFromApi = () => {
    localStorage.removeItem(STORAGE_KEY);
    loadFromApi();
  };

  const totalCount = users.length;
  const apiCount = users.filter((user) => !user.isLocal).length;
  const localCount = users.filter((user) => user.isLocal).length;

  return (
    <div className="user-page">
      <header className="user-page__header">
        <h1 className="user-page__title">Kullanıcı Yönetimi</h1>
      </header>

      <main className="user-page__content">
        <section className="user-page__sidebar">
          <h2 className="user-page__section-title">Özet</h2>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-card__label">Toplam Kullanıcı</span>
              <span className="stat-card__value">{totalCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">API'den Gelen</span>
              <span className="stat-card__value">{apiCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Senin Eklediklerin</span>
              <span className="stat-card__value">{localCount}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetFromApi}
            className="btn btn--outline"
            disabled={loading}
          >
            {loading ? 'Yeniden Yükleniyor...' : 'API Verilerini Yeniden Yükle'}
          </button>

          <p className="user-page__hint">
            Tüm değişiklikler tarayıcınızın LocalStorage alanında saklanır.
          </p>
        </section>

        <section className="user-page__main">
          <div className="user-page__panel">
            <h2 className="user-page__section-title">Yeni Kullanıcı Ekle</h2>
            <form className="user-form" onSubmit={handleAddUser}>
              <div className="user-form__row">
                <label className="user-form__field">
                  <span>Ad Soyad *</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Örnek: Ali Veli"
                  />
                </label>
                <label className="user-form__field">
                  <span>Email *</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="ornek@mail.com"
                  />
                </label>
              </div>

              <div className="user-form__row">
                <label className="user-form__field">
                  <span>Telefon</span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="05xx..."
                  />
                </label>
                <label className="user-form__field">
                  <span>Şirket</span>
                  <input
                    type="text"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    placeholder="Şirket adı (opsiyonel)"
                  />
                </label>
              </div>

              <div className="user-form__actions">
                <button type="submit" className="btn" disabled={loading}>
                  Kullanıcı Ekle
                </button>
              </div>
            </form>
          </div>

          <div className="user-page__panel">
            <div className="user-page__list-header">
              <h2 className="user-page__section-title">Kullanıcılar</h2>
              {loading && <span className="badge badge--info">Yükleniyor...</span>}
              {error && <span className="badge badge--error">{error}</span>}
            </div>

            {users.length === 0 && !loading ? (
              <p className="user-page__empty">Henüz kullanıcı yok. Yeni bir kullanıcı ekleyebilirsin.</p>
            ) : (
              <div className="user-list">
                {users.map((user) => (
                  <article key={user.id} className="user-card">
                    <div className="user-card__header">
                      <h3 className="user-card__name">{user.name}</h3>
                    </div>
                    <div className="user-card__body">
                      {user.email && (
                        <p className="user-card__item">
                          <span className="user-card__label">Email:</span>
                          <span>{user.email}</span>
                        </p>
                      )}
                      {user.phone && (
                        <p className="user-card__item">
                          <span className="user-card__label">Telefon:</span>
                          <span>{user.phone}</span>
                        </p>
                      )}
                      {user.company && (
                        <p className="user-card__item">
                          <span className="user-card__label">Şirket:</span>
                          <span>{user.company}</span>
                        </p>
                      )}
                    </div>
                    <div className="user-card__footer">
                      <button
                        type="button"
                        className="btn btn--danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="user-page__footer" />
    </div>
  );
};

export default TodoPage;