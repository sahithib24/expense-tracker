import { Card, CardContent, Typography } from '@mui/material';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const DashboardCard = ({ title, children }: Props) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {children}
    </CardContent>
  </Card>
);