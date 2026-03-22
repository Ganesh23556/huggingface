async function testAI() {
  const url = 'http://localhost:3000/api/ai';
  const payload = {
    message: "What is this course about?",
    lesson: "Introduction to React",
    course: "Web Development 101"
  };

  console.log("Testing AI API...");
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error testing AI API:", error);
  }
}

testAI();
