import { useEffect, useState } from "react";
import { student } from "../api";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadLeaderboard() {
            try {
                const response =
                    await student.leaderboard();

                setLeaderboard(
                    response.data.leaderboard || []
                );
            } catch (e) {
                console.error(
                    "Leaderboard error:",
                    e
                );

                setError(
                    e.response?.data?.message ||
                    "Could not load leaderboard"
                );
            } finally {
                setLoading(false);
            }
        }

        loadLeaderboard();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <section className="hero">
                <div>
                    <span className="tag">
                        LEADERBOARD
                    </span>

                    <h2>
                        Top Performers 🏆
                    </h2>

                    <p>
                        See how students are performing
                        across completed quizzes.
                    </p>
                </div>
            </section>

            <Alert message={error} />

            <div className="panel table-wrap">
                {leaderboard.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Student</th>
                                <th>Quizzes</th>
                                <th>Average Score</th>
                                <th>Highest Score</th>
                                <th>Total Score</th>
                            </tr>
                        </thead>

                        <tbody>
                            {leaderboard.map((student) => (
                                <tr
                                    key={student.user_id}
                                >
                                    <td>
                                        <strong>
                                            {student.rank <= 3
                                                ? ["🥇", "🥈", "🥉"][
                                                    student.rank - 1
                                                ]
                                                : `#${student.rank}`}
                                        </strong>
                                    </td>

                                    <td>
                                        <b>
                                            {student.name}
                                        </b>
                                    </td>

                                    <td>
                                        {
                                            student.quizzes_attempted
                                        }
                                    </td>

                                    <td>
                                        {
                                            student.average_percentage
                                        }%
                                    </td>

                                    <td>
                                        {
                                            student.highest_percentage
                                        }%
                                    </td>

                                    <td>
                                        {
                                            student.total_score
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty">
                        No completed quiz attempts yet.
                    </div>
                )}
            </div>
        </>
    );
}