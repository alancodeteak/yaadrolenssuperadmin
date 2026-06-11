import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { openCreateModal } from '../store/slices/companiesSlice';
import PageShell from '../components/common/PageShell';
import { LottieLoader } from '../components/common/Lottie';

export default function CreateShop() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openCreateModal());
    navigate('/companies');
  }, [dispatch, navigate]);

  return (
    <PageShell>
      <div className="flex min-h-96 items-center justify-center">
        <LottieLoader size="lg" label="Opening create organization…" centered />
      </div>
    </PageShell>
  );
}
