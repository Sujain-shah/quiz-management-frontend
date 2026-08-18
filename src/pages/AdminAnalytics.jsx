import { useEffect, useState } from "react";
import { admin } from "../api";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

export default function AdminAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAnalytics() {
            try {
                const response = await admin.analytics();

                setAnalytics(response.data);
            } catch (e) {
                console.error("Analytics error:", e);

                setError(
                    e.response?.data?.message ||
                    "Could not load analytics"
                );
            } finally {
                setLoading(false);
            }
        }

        loadAnalytics();
    }, []);

    if (loading) {
        return <Loading />;
    }

    const overview = analytics?.overview || {};

    const quizPerformance =
        analytics?.quizPerformance || [];

    const recentAttempts =
        analytics?.recentAttempts || [];

    const passFailData = [
        {
            name: "Passed",
            value: Number(
                overview.passed_attempts || 0
            )
        },
        {
            name: "Failed",
            value: Number(
                overview.failed_attempts || 0
            )
        }
    ];

    const chartData = quizPerformance.map((quiz) => ({
        name: quiz.quiz_title,
        attempts: Number(quiz.attempts || 0),
        average: Number(
            quiz.average_score || 0
        )
    }));

    return (
        <>
            <section className="hero">
                <div>
                    <span className="tag">
                        ADMIN ANALYTICS
                    </span>

                    <h2>
                        Quiz Performance
                    </h2>

                    <p>
                        Monitor quiz attempts,
                        scores and student performance.
                    </p>
                </div>
            </section>

            <Alert message={error} />

            {/* Overview */}
            <section className="stats-grid">

                <div className="stat-card">
                    <span>Total Attempts</span>
                    <strong>
                        {overview.total_attempts || 0}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Average Score</span>
                    <strong>
                        {overview.average_score || 0}%
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Passed</span>
                    <strong>
                        {overview.passed_attempts || 0}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Failed</span>
                    <strong>
                        {overview.failed_attempts || 0}
                    </strong>
                </div>

            </section>

            {/* Quiz Performance */}
            <section className="section-head">
                <div>
                    <h3>
                        Quiz Performance
                    </h3>

                    <p>
                        Attempts and average scores
                        for each quiz.
                    </p>
                </div>
            </section>

            <div className="quiz-card">
                {chartData.length > 0 ? (
                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 20,
                                left: 0,
                                bottom: 60
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="name"
                                angle={-20}
                                textAnchor="end"
                                interval={0}
                            />

                            <YAxis />

                            <Tooltip />

                            <Legend />

                            <Bar
                                dataKey="attempts"
                                name="Attempts"
                            />

                            <Bar
                                dataKey="average"
                                name="Average Score %"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="empty">
                        No quiz performance data
                        available.
                    </div>
                )}
            </div>

            {/* Pass / Fail */}
            <section className="section-head">
                <div>
                    <h3>
                        Pass / Fail Overview
                    </h3>

                    <p>
                        Overall student result
                        distribution.
                    </p>
                </div>
            </section>

            <div className="quiz-card">
                {overview.total_attempts > 0 ? (
                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >
                        <PieChart>
                            <Pie
                                data={passFailData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {passFailData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            entry.name === "Passed"
                                                ? "#22c55e"
                                                : "#ef4444"
                                        }
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="empty">
                        No completed attempts yet.
                    </div>
                )}
            </div>

            {/* Recent Attempts */}
            <section className="section-head">
                <div>
                    <h3>
                        Recent Attempts
                    </h3>

                    <p>
                        Latest completed quiz attempts.
                    </p>
                </div>
            </section>

            <div className="card-grid">
                {recentAttempts.length > 0 ? (
                    recentAttempts.map(
                        (attempt) => (
                            <div
                                className="quiz-card"
                                key={
                                    attempt.attempt_id
                                }
                            >
                                <span className="tag">
                                    {attempt.passed
                                        ? "PASSED"
                                        : "FAILED"}
                                </span>

                                <h3>
                                    {attempt.quiz_title}
                                </h3>

                                <p>
                                    Student:{" "}
                                    {attempt.student_name}
                                </p>

                                <div className="meta">
                                    <span>
                                        Score:{" "}
                                        {
                                            attempt.percentage
                                        }%
                                    </span>

                                    <span>
                                        {new Date(
                                            attempt.completed_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )
                    )
                ) : (
                    <div className="empty">
                        No completed attempts yet.
                    </div>
                )}
            </div>
        </>
    );
}