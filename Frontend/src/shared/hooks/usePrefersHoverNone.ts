import { useEffect, useState } from 'react';

/**
 * `true` khi thiết bị không có hover chuột tin cậy (hầu hết điện thoại / tablet),
 * dùng để bật/tắt hoạt ảnh xem trước bằng chạm — IX-05.
 */
export function usePrefersHoverNone(): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return matches;
}
