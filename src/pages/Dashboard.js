import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

// ===== SAMPLE DATA =====
const chartData = [
  { day: "Mon", tickets: 340 },
  { day: "Tue", tickets: 290 },
  { day: "Wed", tickets: 410 },
  { day: "Thu", tickets: 460 },
  { day: "Fri", tickets: 720 },
  { day: "Sat", tickets: 890 },
  { day: "Sun", tickets: 650 },
];

export default function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box>
      {/* ===== PAGE TITLE ===== */}
      <Typography
        variant="h4"
        gutterBottom
        className="font-semibold"
        sx={{
          color: theme.palette.text.primary,
          fontFamily: "Poppins",
          mb: 2,
        }}
      >
        🎟️ Dashboard Overview
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{ color: theme.palette.text.secondary, mb: 4 }}
      >
        Welcome back, here’s today’s performance summary.
      </Typography>

      {/* ===== TOP CARDS ===== */}
      <Grid container spacing={3}>
        {/* Card 1 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              borderLeft: `5px solid ${theme.palette.primary.main}`,
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Total Tickets Sold
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontFamily: "Poppins",
                }}
              >
                12,480
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              borderLeft: `5px solid ${theme.palette.primary.main}`,
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Revenue (৳)
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontFamily: "Poppins",
                }}
              >
                8,74,200
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              borderLeft: `5px solid ${theme.palette.primary.main}`,
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Occupancy Rate
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontFamily: "Poppins",
                }}
              >
                78%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              borderLeft: `5px solid ${theme.palette.primary.main}`,
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Active Shows
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontFamily: "Poppins",
                }}
              >
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== CHART SECTION ===== */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontFamily: "Poppins",
            mb: 2,
          }}
        >
          Weekly Ticket Sales
        </Typography>

        <Card
          sx={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            p: 3,
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="day"
                stroke={isDark ? "#d1d5db" : "#374151"}
                tick={{ fontFamily: "Poppins" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(198,160,73,0.15)" }}
                contentStyle={{
                  backgroundColor: isDark ? "#111827" : "#fff",
                  borderRadius: 8,
                  border: `1px solid ${theme.palette.primary.main}`,
                }}
              />
              <Bar
                dataKey="tickets"
                fill={theme.palette.primary.main}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Box>

      {/* ===== FOOTER ===== */}
      <Divider sx={{ mt: 6, mb: 2 }} />
      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          color: theme.palette.text.secondary,
          fontFamily: "Poppins",
          mb: 2,
        }}
      >
        © {new Date().getFullYear()} K-SCREEN Admin Dashboard
      </Typography>
    </Box>
  );
}