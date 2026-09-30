# Dark Green Zone website

Static website: just upload all files and folders to your web hosting.

```
index.html  about.html  services.html  works.html  clients.html  contact.html
estimate.html  tips.html  tip-*.html (3 articles)  service-*.html (10 service pages)
style.css   main.js     favicon.svg    apple-touch-icon.png   robots.txt  sitemap.xml   images/
```

## Features

| Feature | Where |
|---|---|
| Floating WhatsApp, call and back-to-top buttons | Every page |
| Working enquiry forms with validation and spam protection | Services, Contact |
| Photo filters (Lawns / Gardens / Walkways / Commercial) and full-screen viewer | Our Works |
| Fade-in on scroll and counting-up stats | Home, About |
| Customer reviews slider | Home |
| FAQ (click to expand) | Services |
| Google Map and "Get directions" | Contact |
| SEO: page descriptions, share previews, Google business info, favicon, sitemap | Every page |
| Dark / light mode switch (remembers the visitor's choice) | Header, every page |
| Services dropdown menu | Header |
| A page for each of the 10 services, with its own enquiry form | `service-*.html` |
| Free estimate calculator that sends the estimate as an enquiry | `estimate.html` |
| Book a site visit (preferred date and time) | Contact, Estimate |
| Garden tips blog with 3 articles | `tips.html`, `tip-*.html` |
| Recent projects and garden tips sections | Home |

## Before going live – please check

1. **Turn on the contact forms.** Go to https://web3forms.com, enter the email
   that should receive enquiries, and copy the access key they send you. Paste it
   in `main.js` at the top:
   `var WEB3FORMS_ACCESS_KEY = "paste-your-key-here";`
   Until then, forms open the visitor's email app instead.
2. **Replace `anbu@localhost`** with your real email in all the `.html` files and
   in `FALLBACK_EMAIL` in `main.js`.
3. **Testimonials** (`index.html`, "What Our Clients Say"): replace the three
   placeholder reviews with real ones from your customers.
4. **Stats numbers** (`index.html` and `about.html`, `class="stats"`): change the
   `data-target` values (projects, clients) to your real numbers. "Years of
   experience" counts from 2016 automatically.
5. **Photo categories** (`works.html`): each photo has
   `data-category="lawn|garden|walkway|commercial"`, chosen by looking at the
   photo. Change any you'd put in a different group.
6. **Your domain**: replace `YOUR-DOMAIN.com` in `sitemap.xml` and `robots.txt`.
   Submit the sitemap in Google Search Console.
7. **Map pin**: check that the map on the Contact page points to the right spot.
   If not, search your address on Google Maps, choose Share → Embed a map, and
   paste that `src` link into the `<iframe>` in `contact.html`.
8. **Estimate prices**: the rates in `main.js` (`ESTIMATE_RATES`,
   `PROPERTY_FACTOR`, `MIN_CHARGE`) are SAMPLE numbers. Replace them with your
   real rates before going live. Set a service to `null` to show
   "Price after site visit" instead of a number.
9. **Service and tip text**: the service pages and garden tips were written
   for you. Read them and change anything that doesn't match how you work.
