---
author: Ramachandran Nellaiyappan
createdAt: 04.11.2024
updatedAt: 
categories:
  - Data Quality
tags:
  - Data Quality
  - Validations
---
# Improve Data Quality

List of improvements to improve application data quality.

## Mobile Phone Number

- Validate mobile number based on real time criteria based country code and length. Refer article for more
  info [Phone Number Validation](../java/validations.md#phone-number-validation).

## Address Data

- [GeoCoding APIs](https://en.wikipedia.org/wiki/Address_geocoding) improves data quality by converting addresses into
  precise geographic coordinates, ensuring location data is accurate and consistently formatted.
- It minimizes errors in user-entered addresses and enriches data with useful details like postal codes and
  administrative regions.
- Many GeoCoding APIs are available in market including paid and free versions. Some of them as follows,
    - [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview)
    - [MapTiler GeoCoding API](https://www.maptiler.com/cloud/geocoding/)
    - [MapBox Geocoding API](https://docs.mapbox.com/api/search/geocoding/)

