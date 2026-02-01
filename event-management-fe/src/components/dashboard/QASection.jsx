import { useEffect, useState } from "react";
import { viewQuestions, askQuestion, answerQuestion } from "../../api/qaApi";

export default function QASection({ eventId, userId, isOrganizer, creatorId }) {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const refreshQuestions = () => {
    viewQuestions(eventId)
      .then((res) => setQuestions(res.data.data || []))
      .catch(() => setQuestions([]));
  };

  useEffect(() => {
    refreshQuestions();
  }, [eventId]);

  const submitQuestion = async () => {
    if (!question.trim() || !userId) return;
    try {
      await askQuestion(userId, eventId, question.trim());
      setQuestion("");
      refreshQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit question");
    }
  };

  const submitAnswer = async (qaId) => {
    if (!answerText.trim() || !creatorId) return;
    try {
      await answerQuestion(qaId, creatorId, answerText.trim());
      setAnsweringId(null);
      setAnswerText("");
      refreshQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit answer");
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-3">Q & A</h3>

      <div className="space-y-3 max-h-48 overflow-y-auto">
        {questions.length === 0 ? (
          <p className="text-gray-500 text-sm">No questions yet. Be the first to ask!</p>
        ) : (
          questions.map((q) => (
            <div key={q.qaId} className="border rounded-lg p-3 bg-gray-50">
              <p className="font-semibold text-gray-800">{q.question}</p>
              {q.answer ? (
                <p className="text-sm text-green-700 mt-1">Answer: {q.answer}</p>
              ) : isOrganizer && creatorId ? (
                answeringId === q.qaId ? (
                  <div className="mt-2">
                    <input
                      className="input text-sm"
                      placeholder="Your answer..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="btn-primary text-sm py-1 px-2"
                        onClick={() => submitAnswer(q.qaId)}
                      >
                        Submit
                      </button>
                      <button
                        className="btn-secondary text-sm py-1 px-2"
                        onClick={() => {
                          setAnsweringId(null);
                          setAnswerText("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="text-blue-600 text-sm mt-1 hover:underline"
                    onClick={() => setAnsweringId(q.qaId)}
                  >
                    Answer this question
                  </button>
                )
              ) : null}
            </div>
          ))
        )}
      </div>

      {userId && !isOrganizer && (
        <div className="flex gap-2 mt-3">
          <input
            className="input flex-1"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitQuestion()}
          />
          <button className="btn-primary" onClick={submitQuestion}>
            Ask
          </button>
        </div>
      )}
    </div>
  );
}
