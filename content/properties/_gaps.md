# Developments — data gaps

One row per development, listing every schema field **left empty** because the brochure did not state it. Nothing here was inferred — these are the fields to chase from each developer to complete the listing. Generated from the `content/properties/<slug>/data.json` files.

`price` is never blank: where no figure was stated it defaults to "Register your interest" and is flagged below as **(price: no figure stated)**.

## Missing fields per development

| Development | Slug | Fields still missing (chase from developer) |
| --- | --- | --- |
| Aire Gardens | `aire-gardens-leeds` | address, warranty **(price: no figure stated)** |
| Crown Works | `crown-works-burton` | tenure, completion, totalUnits, sizeRange, paymentStructure, warranty, highlightedFeatures, developmentAmenities, nearestStation **(price: no figure stated)** |
| Elizabeth House | `elizabeth-house-staines` | sizeRange |
| Fountain Court | `fountain-court-birmingham` | tenure, completion, sizeRange, paymentStructure, warranty, developmentAmenities **(price: no figure stated)** |
| Graduation House | `graduation-house-nottingham` | address, postcode, tenure, completion, sizeRange, warranty, specification |
| Mulberry House | `mulberry-house-derby` | tenure, completion, sizeRange, paymentStructure, warranty, developmentAmenities **(price: no figure stated)** |
| One Victoria | `one-victoria-manchester` | tenure, completion, sizeRange, paymentStructure **(price: no figure stated)** |
| Piccadilly Wharf | `piccadilly-wharf-manchester` | address, postcode, developer, sizeRange, warranty, headline, description, highlightedFeatures, specification **(price: no figure stated)** |
| Priors Gate | `priors-gate-birmingham` | developer, sizeRange, headline, description, highlightedFeatures, specification, nearestStation, locationNotes **(price: no figure stated)** |
| St. George's Terrace | `st-georges-terrace-york` | address, postcode, tenure, completion, sizeRange, paymentStructure, warranty, developmentAmenities, nearestStation **(price: no figure stated)** |
| Waterhouse Gardens | `waterhouse-gardens-manchester` | tenure, completion, sizeRange, paymentStructure, warranty, highlightedFeatures, nearestStation **(price: no figure stated)** |

## Field coverage matrix

✓ = extracted from brochure · — = not stated (gap)

| Field | aire&#8209;gardens&#8209;leeds | crown&#8209;works&#8209;burton | elizabeth&#8209;house&#8209;staines | fountain&#8209;court&#8209;birmingham | graduation&#8209;house&#8209;nottingham | mulberry&#8209;house&#8209;derby | one&#8209;victoria&#8209;manchester | piccadilly&#8209;wharf&#8209;manchester | priors&#8209;gate&#8209;birmingham | st&#8209;georges&#8209;terrace&#8209;york | waterhouse&#8209;gardens&#8209;manchester |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| name | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| address | — | ✓ | ✓ | ✓ | — | ✓ | ✓ | — | ✓ | — | ✓ |
| postcode | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | — | ✓ | — | ✓ |
| locality | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| price | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| tenure | ✓ | — | ✓ | — | — | — | — | ✓ | ✓ | — | — |
| developer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ |
| completion | ✓ | — | ✓ | — | — | — | — | ✓ | ✓ | — | — |
| totalUnits | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| sizeRange | ✓ | — | — | — | — | — | — | — | — | — | — |
| unitMix | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| paymentStructure | ✓ | — | ✓ | — | ✓ | — | — | ✓ | ✓ | — | — |
| warranty | — | — | ✓ | — | — | — | ✓ | — | ✓ | — | — |
| headline | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ |
| description | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ |
| highlightedFeatures | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | — |
| developmentAmenities | ✓ | — | ✓ | — | ✓ | — | ✓ | ✓ | ✓ | — | ✓ |
| specification | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | — | — | ✓ | ✓ |
| nearestStation | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — |
| locationNotes | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |

## Completeness

| Development | Fields populated | of | % |
| --- | :-: | :-: | :-: |
| Aire Gardens | 18 | 20 | 90% |
| Crown Works | 11 | 20 | 55% |
| Elizabeth House | 19 | 20 | 95% |
| Fountain Court | 14 | 20 | 70% |
| Graduation House | 13 | 20 | 65% |
| Mulberry House | 14 | 20 | 70% |
| One Victoria | 16 | 20 | 80% |
| Piccadilly Wharf | 11 | 20 | 55% |
| Priors Gate | 12 | 20 | 60% |
| St. George's Terrace | 11 | 20 | 55% |
| Waterhouse Gardens | 13 | 20 | 65% |

