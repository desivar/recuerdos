app.get('/api/search', async (req, res) => {
  try {
    const { name, category, recordType, letter } = req.query;
    let query = {};

    // 1. Filter by Name (Search bar)
    if (name) query.fullName = { $regex: name, $options: 'i' };

    // 2. Filter by Category (Portraits or News)
    if (category) query.category = category;

    // 3. Filter by Record Type (DOB, DOD, Marriage)
    if (recordType) query.category = recordType;

    // 4. Filter by Alphabet (Surname Index)
    if (letter) query.fullName = { $regex: `^${letter}`, $options: 'i' };

    const results = await Record.find(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});