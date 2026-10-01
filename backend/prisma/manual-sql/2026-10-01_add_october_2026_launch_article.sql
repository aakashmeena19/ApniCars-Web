BEGIN;

DO $migration$
DECLARE
  v_news_id INTEGER;
BEGIN
  INSERT INTO news (
    category_id,
    author_id,
    created_by,
    updated_by,
    title,
    slug,
    excerpt,
    body,
    cover_image_url,
    read_time_minutes,
    status,
    is_active,
    scheduled_at,
    published_at,
    view_count,
    meta_title,
    meta_description,
    meta_keywords,
    og_image_url,
    created_at,
    updated_at
  )
  SELECT
    category.id,
    1,
    1,
    1,
    'October 2026 Car Launch Calendar: 9 Models Indian Buyers Should Watch',
    'october-2026-car-launches-india',
    'From practical facelifts to flagship EVs and luxury sedans, October brings one of the busiest new-car calendars of 2026. Here is what buyers should watch.',
    $article$
<p>October is shaping up to be one of the most varied months of 2026 for Indian car buyers. The expected arrivals cover almost every end of the market: an updated premium hatchback, refreshed family cars, a new compact luxury SUV, two flagship electric vehicles and one of the most opulent sedans on sale.</p>

<p>The dates and specifications below reflect the latest information available on 1 October 2026. Launch schedules can move, and final India-specific variants, prices and equipment remain subject to manufacturer confirmation. That distinction matters because several cars on this list have been revealed, while others are still approaching their formal Indian debut.</p>

<h2>October 2026 launch calendar at a glance</h2>
<ul>
  <li><strong>5 October:</strong> Mercedes-Maybach S-Class facelift</li>
  <li><strong>6 October:</strong> Honda Elevate facelift and Skoda Slavia facelift</li>
  <li><strong>12 October:</strong> Volvo ES90 and Volvo EX90</li>
  <li><strong>14 October:</strong> Toyota Glanza facelift</li>
  <li><strong>16 October:</strong> new-generation Audi Q3</li>
  <li><strong>17 October:</strong> Renault Duster Hybrid</li>
  <li><strong>Mid-to-late October:</strong> Hyundai Bayon</li>
</ul>

<h2>1. Mercedes-Maybach S-Class facelift: the luxury flagship arrives first</h2>
<p>Mercedes-Benz is expected to open the month with the refreshed Maybach S-Class. The update is less about changing the car's core character and more about keeping its technology, materials and road presence at the top of the luxury-sedan market. The longer wheelbase, rear-seat focus and highly personalised cabin remain central to the Maybach experience.</p>

<p>Internationally, the range includes electrified V8 options as well as a V12 at the very top. The final Indian engine line-up is still to be confirmed. For buyers, the more important questions will be the locally offered configuration, customisation choices and pricing relative to the outgoing model.</p>

<h2>2. Honda Elevate facelift: a timely family-SUV update</h2>
<p>The Elevate has always leaned on a straightforward formula: a naturally aspirated petrol engine, generous cabin space and easy everyday manners. Its facelift is expected to sharpen the design and address feature gaps with additions such as a larger infotainment system, ventilated front seats and a surround-view camera, depending on the final variant structure.</p>

<p>Honda is likely to retain the familiar 1.5-litre petrol engine with manual and CVT choices. A hybrid option has been widely discussed, but buyers should wait for the official announcement before treating it as confirmed. If it arrives, it could materially broaden the Elevate's appeal against hybrid rivals.</p>

<h2>3. Skoda Slavia facelift: useful upgrades beyond a cosmetic refresh</h2>
<p>The updated Slavia is important because its changes are expected to go deeper than revised bumpers and lighting. A larger digital instrument display, additional parking assistance and rear-seat comfort features should make the sedan feel more competitive without abandoning the driving character that built its following.</p>

<p>The familiar 1.0-litre and 1.5-litre turbo-petrol engines are expected to continue. The smaller engine is set to gain an eight-speed torque-converter automatic in place of the earlier six-speed unit, while the stronger 1.5 TSI should retain its dual-clutch transmission. Final prices will decide whether the sedan can turn its richer equipment list into stronger value.</p>

<figure>
  <img src="/uploads/news/october-2026-mainstream-launches.avif" alt="A midsize SUV and sedan driving on an urban Indian highway" />
  <figcaption>Refreshed SUVs and sedans will account for several of October's most relevant launches. Representative image.</figcaption>
</figure>

<h2>4. Volvo ES90: an electric sedan with long-distance intent</h2>
<p>The ES90 marks Volvo's return to the premium sedan conversation, this time with a fully electric platform. Its international specification pairs a large battery with an 800-volt electrical architecture designed to support rapid DC charging. The cabin follows Volvo's restrained approach, placing more emphasis on space, software and safety than visual drama.</p>

<p>India-specific range and charging figures will need confirmation at launch. Even so, the ES90 matters because it gives luxury-EV buyers an alternative to the increasingly common SUV body style.</p>

<h2>5. Volvo EX90: the flagship electric SUV</h2>
<p>Launching alongside the ES90, the EX90 takes Volvo's electric technology into a large three-row SUV. Its appeal should come from a combination of family practicality, advanced driver-assistance hardware and a calm, premium cabin. It will sit above Volvo's smaller electric models and compete in a segment where space and charging confidence matter as much as outright acceleration.</p>

<p>Pricing will be crucial. A well-judged India specification could make the EX90 a credible alternative for buyers considering a high-end petrol SUV but wanting to move to electric power.</p>

<h2>6. Toyota Glanza facelift: the high-volume update</h2>
<p>Among all the cars arriving this month, the Glanza facelift may be one of the most relevant to the largest number of buyers. It is expected to adopt styling and equipment changes related to the updated Baleno while retaining Toyota's own variant and warranty positioning.</p>

<p>Expect a revised front end, fresh wheels and incremental cabin improvements rather than a completely new package. Petrol and CNG choices should remain central to the range. The final feature distribution across variants will determine whether the Glanza continues to justify its position beside its Maruti Suzuki sibling.</p>

<h2>7. Audi Q3: a new generation for the compact luxury class</h2>
<p>The new Q3 is expected to bring a sharper exterior, a more contemporary cabin and improved packaging to Audi's entry luxury-SUV range. Its role is significant: the Q3 is often the first Audi for a buyer moving up from a mainstream premium SUV, so perceived quality and standard equipment carry unusual weight.</p>

<p>The India-spec powertrain and variant list will be announced with prices. Buyers comparing it with the BMW X1 and Mercedes-Benz GLA should look beyond the headline number and examine standard safety, infotainment and comfort equipment.</p>

<h2>8. Renault Duster Hybrid: the powertrain that could reshape the comeback</h2>
<p>The Duster name returned because it still carries strong recognition among Indian SUV buyers. The expected hybrid version is the more strategically interesting addition: it could combine the Duster's practical positioning with lower urban fuel consumption and smoother low-speed driving.</p>

<p>Reports point to a 1.8-litre hybrid system supported by electric motors, although final Indian specifications must be confirmed by Renault. Price placement will decide whether the hybrid becomes a mainstream choice or remains a premium derivative.</p>

<h2>9. Hyundai Bayon: a new crossover between established segments</h2>
<p>The Bayon is expected to join Hyundai's Indian range during the middle or latter part of October. Its likely positioning between the Venue and Creta gives it an interesting job: offer more road presence and cabin flexibility than a sub-four-metre SUV without moving too close to the Creta on price.</p>

<p>Because its precise launch timing and India-specific equipment are not yet as settled as the early-October arrivals, buyers should treat current estimates as provisional. Its final dimensions, engine choices and introductory prices will reveal whether it creates a distinct niche or simply adds another option to an already crowded crossover market.</p>

<figure>
  <img src="/uploads/news/october-2026-premium-ev-launches.avif" alt="A premium electric SUV and sedan charging at a modern station" />
  <figcaption>The arrival of flagship electric models gives October's launch calendar more than just conventional facelifts. Representative image.</figcaption>
</figure>

<h2>Which October launches matter most?</h2>
<p>For value-conscious buyers, the Elevate, Slavia and Glanza updates deserve the closest attention because their final prices and variant equipment could change shortlists immediately. The Duster Hybrid may have the largest long-term impact if Renault can make the technology accessible rather than positioning it as a niche flagship.</p>

<p>At the premium end, the Audi Q3 will matter for volume, while the Volvo duo will show how much appetite exists for large luxury EVs outside established German brands. The Maybach sits in a different world, but it still sets a useful benchmark for cabin technology and rear-seat luxury.</p>

<h2>What buyers should do before booking</h2>
<p>Do not make a decision from an expected feature list alone. Wait for the official brochure, compare the exact variant, confirm the ex-showroom and on-road price in your city, and ask for a written delivery estimate. For EVs and hybrids, also check warranty coverage, home-charging requirements and the availability of trained service support nearby.</p>

<p>October's variety is good news, but the best launch is not automatically the best car for every buyer. The smart move is to shortlist by usage, budget and ownership needs, then compare confirmed specifications after each model is formally launched.</p>

<h2>Sources and update note</h2>
<p>Launch timing and expected specifications were independently checked against current reporting from <a href="https://www.autocarindia.com/car-news/upcoming-car-launches-and-debuts-in-october-2026-440877" rel="nofollow noopener">Autocar India</a>, <a href="https://www.cardekho.com/news/general/upcoming-cars-launching-in-october-2026-from-skoda-slavia-facelift-to-audi-q3-36740.htm" rel="nofollow noopener">CarDekho</a> and <a href="https://www.carwale.com/new-car-launches/" rel="nofollow noopener">CarWale</a> on 1 October 2026. This article is original ApniCars editorial content and will be updated if manufacturers revise their schedules or announce final India specifications.</p>
    $article$,
    '/uploads/news/october-2026-car-launches-cover.avif',
    8,
    'published',
    true,
    NULL,
    CURRENT_TIMESTAMP,
    0,
    '9 Upcoming Cars Launching in India in October 2026',
    'Explore nine important October 2026 car launches in India, including the Honda Elevate facelift, Audi Q3, Volvo EX90 and Renault Duster Hybrid.',
    'October 2026 car launches, upcoming cars India, Honda Elevate facelift, Audi Q3, Volvo EX90, Renault Duster Hybrid',
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  FROM news_categories AS category
  WHERE category.slug = 'new-car-launches'
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO v_news_id;

  IF v_news_id IS NOT NULL THEN
    INSERT INTO news_brands (news_id, brand_id)
    SELECT v_news_id, brand.id
    FROM brands AS brand
    WHERE brand.id IN (5, 6, 10, 12, 14, 16, 21)
    ON CONFLICT (news_id, brand_id) DO NOTHING;

    INSERT INTO news_car_models (news_id, model_id)
    SELECT v_news_id, model.id
    FROM car_models AS model
    WHERE model.id IN (161, 217, 325, 405, 459, 478, 644)
    ON CONFLICT (news_id, model_id) DO NOTHING;

    INSERT INTO admin_logs (admin_id, description, ip_address, created_at)
    VALUES (
      1,
      'Published news article "October 2026 Car Launch Calendar" via reviewed manual migration',
      NULL,
      CURRENT_TIMESTAMP
    );
  END IF;
END
$migration$;

COMMIT;
