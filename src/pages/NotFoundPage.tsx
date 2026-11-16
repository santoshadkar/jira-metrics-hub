import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.tsx';

export default function NotFoundPage() {
  return (
    <>
      <PageHeader title="Page not found">
        <p>There is nothing at this address.</p>
      </PageHeader>
      <Link to="/" className="text-blue-700 underline dark:text-blue-300">
        Go to the home page
      </Link>
    </>
  );
}
