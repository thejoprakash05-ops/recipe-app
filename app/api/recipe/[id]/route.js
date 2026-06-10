export async function GET(_req, { params }) {
  const { id } = await params;
  const apiKey = process.env.SPOONACULAR_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: 'SPOONACULAR_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`
    );
    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: data.message }, { status: res.status });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
