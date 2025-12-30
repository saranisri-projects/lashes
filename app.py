from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "super-secret-key"  # change later


reviews = [
    {"name": "hope", "rating": 5, "text": "100% recommend, nina is amazing🩷"},
    {"name": "Annie Blackwell", "rating": 5, "text": "The lashes were beautiful and have stayed on very well compared to other places I’ve tried in the past. Michelle is amazing and would definitely recommend her to anyone!"},
    {"name": "Julia", "rating": 4, "text": "Great results, will come again!"},
]


@app.route("/", methods=["GET", "POST"])
def home():
    global reviews

    if request.method == "POST":
        reviews.append({
            "name": request.form["name"],
            "rating": int(request.form["rating"]),
            "text": request.form["text"]
        })
        return redirect(url_for("home"))

    avg_rating = round(sum(r["rating"] for r in reviews) / len(reviews), 1)
    total = len(reviews)

    counts = {i: 0 for i in range(1, 6)}
    for r in reviews:
        counts[r["rating"]] += 1

    return render_template(
        "index.html",
        reviews=reviews,
        avg_rating=avg_rating,
        total_reviews=total,
        rating_counts=counts
    )


@app.route("/booking-policy")
def booking_policy():
    return render_template("booking_policy.html")

@app.route("/services")
def services():
    services_data = {
        "Full Sets": [
            {"name": "Classic Full Set", "price": "$95", "duration": "1 hr 45 mins"},
            {"name": "Hybrid Full Set", "price": "$125", "duration": "2 hrs"},
            {"name": "Volume Full Set", "price": "$135", "duration": "2 hrs"},
            {"name": "Mega Volume Full Set", "price": "$140", "duration": "2 hrs"},
            {"name": "Signature Full Set", "price": "$135", "duration": "2 hrs"},
            {"name": "Prom Lashes", "price": "$100", "duration": "2 hrs"},
            {"name": "Your Better Half Set", "price": "$55", "duration": "50 mins"},
            {"name": "Lashes at your Service", "price": "$250", "duration": "2 hrs 45 mins"},
            {"name": "Brown Lash Set", "price": "$135", "duration": "2 hrs"}

        ],
        "Refills": [
            {"name": "Classic Refill", "price": "$60", "duration": "1 hr 15 mins"},
            {"name": "Hybrid Refill", "price": "$75", "duration": "1 hr 15 mins"},
            {"name": "Volume Refill", "price": "$85", "duration": "1 hr 40 mins"},
            {"name": "Mega Volume Refill", "price": "$90", "duration": "1 hr 30 mins"},
            {"name": "Mini Refill", "price": "$45", "duration": "45 mins"}

        ],
        "Removal": [
            {"name": "Lash Removal", "price": "$35", "duration": "30 mins"}
        ],

        "Brows": [
            {"name": "Signature Brow Lamination", "price": "$105", "duration": "1 hr"},
            {"name": "Signature Brow Wax & Tint", "price": "$60", "duration": "1 hr"}
        ],
        "Tooth Gems": [
            {"name": "Tooth Gem", "price": "$75", "duration": "30 min"}
        ]
    }

    date = request.args.get("date")
    time = request.args.get("time")
    team = request.args.get("team")

    return render_template("services.html", services=services_data, date=date, time=time, team=team)

# add to cart redirects
@app.route("/add-to-cart", methods=["POST"])
def add_to_cart():
    session["booking"] = {
        "date": request.form["date"],
        "time": request.form["time"],
        "team": request.form["team"],
        "service": request.form["service"]
    }
    return redirect(url_for("cart"))

# cart
@app.route("/cart")
def cart():
    booking = session.get("booking")
    return render_template("cart.html", booking=booking)

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/team")
def team():
    team_members = [
        {
            "name": "Nina",
            "role": "Senior Lash Artist",
            "image": "nina.jpg"
        },
        {
            "name": "Venus",
            "role": "Dream Lash Senior Artist",
            "image": "venus.webp"
        },
        {
            "name": "Asiah",
            "role": "Lashious Beauty Senior Artist",
            "image": "asiah.webp"
        },
        {
            "name": "Michelle",
            "role": "Diva Lashes Senior Brow Artist",
            "image": "michelle.webp"
        }
    ]
    return render_template("team.html", team=team_members)

# booking redirect form services
@app.route("/book")
def book():
    service = request.args.get("service")
    return render_template("book.html", service=service)


if __name__ == "__main__":
    app.run(debug=True)
