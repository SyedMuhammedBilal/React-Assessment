import React from "react";
import { useInfiniteQuery } from "react-query";
import { IPost } from "../../types/posts.type";

const Posts = () => {
  const [search, setSearch] = React.useState<string>("");
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const fetchPosts = async ({ pageParam = 0 }) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageParam}`
    );
    return res.json();
  };

  const { data, fetchNextPage } = useInfiniteQuery("posts", fetchPosts, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) {
        return undefined;
      }
      return pages.length + 1;
    },
  });

  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      fetchNextPage();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage]);

  const getRandomDate = () => {
    const start = new Date(2012, 0, 1);
    const end = new Date();
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        const filteredPosts: any = data?.pages

          .flat()
          .filter((post) => post.title.includes(search));
        setPosts(filteredPosts);
      } else {
        setPosts(data?.pages?.flat() as any);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, data]);

  const sort = () => {
    if (data) {
      const sortedPosts = data.pages.flat().sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
      setPosts(sortedPosts);
    }
  };

  return (
    <div>
      <div className="flex flex-col pb-2 pt-10 pl-96 pr-96 overflow-auto justify-center items-center">
        <div className="flex flex-col w-full">
          <label htmlFor="search" className="text-gray-700">
            Search Posts
          </label>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search posts"
            className="border border-gray-300 p-2 rounded mt-1 mb-5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-col w-full items-start">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={sort}
          >
            Sort pots by title
          </button>
        </div>

        <React.Fragment>
          {posts.map((post: IPost) => (
            <div
              className="relative w-full flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100 
              border-2 border-black-500
              "
              draggable="true"
              key={post.id}
            >
              <button
                className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              <span className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full">
                {post.title}
              </span>
              <h4 className="mt-3 text-sm font-medium">{post.body}</h4>
              <div className="flex items-center w-full mt-3 text-xs font-medium text-gray-400">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-300 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1 leading-none">
                    {getRandomDate().toDateString()}
                  </span>
                </div>

                <div className="flex items-center ml-4">
                  <svg
                    className="w-4 h-4 text-gray-300 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1 leading-none">{post?.id}</span>
                </div>
                <img
                  className="w-6 h-6 ml-auto rounded-full"
                  alt="pic"
                  src="https://randomuser.me/api/portraits/women/26.jpg"
                />
              </div>
            </div>
          ))}
        </React.Fragment>
      </div>
    </div>
  );
};

export default Posts;
