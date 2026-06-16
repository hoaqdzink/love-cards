import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

type HomeSearchBarProps = {
  className?: string;
  size?: 'md' | 'lg';
};

export function HomeSearchBar({ className = '', size = 'md' }: HomeSearchBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      navigate('/mau-thiep');
      return;
    }
    navigate(`/mau-thiep?q=${encodeURIComponent(trimmed)}`);
  }

  const inputClass =
    size === 'lg'
      ? 'py-4 pl-12 pr-14 text-base'
      : 'py-3 pl-11 pr-12 text-sm';

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <label className="sr-only" htmlFor="home-search">
        {t('home.search.label')}
      </label>
      <MagnifyingGlass
        size={size === 'lg' ? 22 : 20}
        weight="bold"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate/40"
        aria-hidden
      />
      <input
        id="home-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('home.search.placeholder')}
        className={`w-full rounded-full border border-lightrose bg-white text-slate shadow-card outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 ${inputClass}`}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-rose text-white transition-colors hover:bg-rose/90 focus-visible:ring-2 focus-visible:ring-rose/40"
        aria-label={t('home.search.submit')}
      >
        <ArrowRight size={18} weight="bold" />
      </button>
    </form>
  );
}
