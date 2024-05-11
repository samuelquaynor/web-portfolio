import { storage, app } from "../../firebase.js";
import { useEffect, useState } from "react";
import { getDownloadURL, listAll, ref } from "firebase/storage";

import portfolios from "./portfolio_list.json";
import ReactPaginate from "react-paginate";


export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState(portfolios);

  useEffect(() => {
    // Function to fetch the storage items
    const getAllImages = async () => {
      try {
        const updatedPortfolioItems = await Promise.all(
          portfolios.map(async (portfolio) => {
            // if (portfolio.ref.length <= 1) {
              const listRef = ref(storage, `portfolio/${portfolio.ref[0]}/`);
              const listResult = await listAll(listRef);
              const imageUrls = await Promise.all(
                listResult.items.map(async (itemRef) => {
                  return await getDownloadURL(itemRef);
                })
              );

              // Return a new portfolio object with the updated images array
            return { ...portfolio, images: imageUrls };
            
          })
        );

        // Update the state with the updated portfolio items
        setPortfolioItems(updatedPortfolioItems);

      } catch (error) {
        console.error("Error updating portfolio images:", error);
      }
    };

    // Call the function to get the updated portfolio items
    getAllImages();
  }, []);

  return (
    <>
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Portfolio</h2>
            <p>My Works</p>
          </div>
          <div className="row portfolio-container">
            {portfolioItems.map((porfolio) => (
              <div
                key={porfolio.id}
                className={`col-lg-4 col-md-6 portfolio-item ${
                  porfolio.category == "App" ? "filter-app" : "filter-web"
                } `}
              >
                <div className="portfolio-wrap">
                  <img
                    src={porfolio.images[0]}
                    className="img-fluid"
                    alt="Portfolio Image"
                  />
                  <div key={porfolio.id} className="portfolio-info">
                    <h4>{porfolio.title}</h4>
                    <p>{porfolio.category}</p>
                    <div className="portfolio-links">
                      <a
                        href={porfolio.images[0]}
                        data-gallery="portfolioGallery"
                        className="portfolio-lightbox"
                        title={porfolio.title}
                      >
                        <i className="bx bx-plus" />
                      </a>
                      <a
                        href={`portfolio/${porfolio.id}`}
                        data-gallery="portfolioDetailsGallery"
                        data-glightbox="type: external"
                        className="portfolio-details-lightbox"
                        title="Portfolio Details"
                      >
                        <i className="bx bx-link" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
