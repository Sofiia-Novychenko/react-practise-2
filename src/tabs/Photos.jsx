import Text from '../components/Text/Text';
import Form from '../components/Form/Form';
import { useEffect, useState } from 'react';
import PhotosGallery from '../components/PhotosGallery/PhotosGallery';
import { getPhotos } from '../apiService/photos';
import Loader from '../components/Loader/Loader';
import Button from '../components/Button/Button';

const Photos = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isVisible, setisVisible] = useState(false);

  useEffect(() => {
    if (!query) return;
    const fetchPhotos = async () => {
      setIsLoading(true);
      try {
        const { photos, per_page, total_results } = await getPhotos(
          query,
          page
        );
        if (!photos.length) {
          setIsEmpty(true);
          return;
        }
        setImages(prevImages => [...prevImages, ...photos]);
        setisVisible(page < Math.ceil(total_results / per_page));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPhotos();
  }, [page, query]);

  const GetQuery = inputValue => {
    setQuery(inputValue);
    setImages([]);
    setPage(1);
    setError(null);
    setIsEmpty(false);
    setisVisible(false);
  };

  const handleClick = () => {
    setPage(prevPage => prevPage + 1);
  };
  return (
    <>
      <Form onSubmit={GetQuery} />
      {isLoading && <Loader />}
      {error && <Text textAlign="center">Oops! Something went wrong...</Text>}
      {!error && !isEmpty && (
        <Text textAlign="center">Let`s begin search 🔎</Text>
      )}
      {isEmpty && (
        <Text textAlign="center">Sorry, we couldn't find anything</Text>
      )}
      {images.length > 0 && <PhotosGallery images={images} />}
      {isVisible && (
        <Button onClick={handleClick} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load more'}{' '}
        </Button>
      )}
    </>
  );
};

export default Photos;
